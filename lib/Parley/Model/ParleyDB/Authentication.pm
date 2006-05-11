package Parley::Model::ParleyDB::Authentication;

use strict;
use warnings;
use base 'DBIx::Class::Core';

__PACKAGE__->table('authentication');
__PACKAGE__->add_columns(qw/
    authentication_id
    username
    password
    authenticated
/);
__PACKAGE__->set_primary_key('authentication_id');
__PACKAGE__->sequence('authentication_authentication_id_seq');


=head1 NAME

Parley::Model::ParleyDB::Authentication - Catalyst DBIC Table Model

=head1 SYNOPSIS

See L<Parley>

=head1 DESCRIPTION

Catalyst DBIC Table Model.

=head1 AUTHOR

Chisel Wright C<< <pause@herlpacker.co.uk> >>

=head1 LICENSE

This library is free software, you can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
